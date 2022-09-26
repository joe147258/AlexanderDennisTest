using AlexanderDennisTest.Database;
using AlexanderDennisTest.Domain;
using FluentEmail.Core;
using Newtonsoft.Json;
using System.Globalization;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace AlexanderDennisTest.Service
{
    public static class BookingService
    {
        public static readonly DatabaseConnector DbConnector = new DatabaseConnector();

        public static bool ValidateAndStore(string body)
        {
            FormData engineerFormData = JsonConvert.DeserializeObject<FormData>(body) ?? throw new ArgumentException();
            if (engineerFormData == null) return false;
            if (!engineerFormData.ValidateInput()) return false;
            string[] bookedTimes = GetFullyBookedTimeSlotsFromDate(engineerFormData.Date);
            if (bookedTimes.Contains(engineerFormData.TimeSlot)) return false;
            DbConnector.StoreEngineerBooking(engineerFormData);

            SaveToDisk(engineerFormData);
            // Generic try catch to carry this method on.
            try
            {
                GenerateAndSendEmail(engineerFormData);
            }
            catch (Exception)
            { 
                
            }

            return true;
        }

        public static string[] GetFullyBookedTimeSlotsFromDate(string date)
        {
            // Ensures the correct type of date is passed
            try
            {
                DateTime result = DateTime.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture);
            }
            catch (FormatException)
            {
                throw new ArgumentException("Non valid date passed.");
            }
            return DbConnector.GetFullyBookedTimeSlots(date);
        }

        public static string GetAllBookings() 
        {
            return DbConnector.GetAllBookingsJson();
        }

        public static string GetDatabaseBooking(int id)
        {
            return DbConnector.GetDatabaseBooking(id);
        }

        public static void SaveToDisk(FormData engineerFormData)
        {
            string json = JsonConvert.SerializeObject(engineerFormData, Formatting.Indented);

            //write json string to file
            System.IO.File.WriteAllText($"{engineerFormData.Date} {engineerFormData.AddressLineOne}.json", json);

            using StringWriter XmlWriter = new StringWriter();
            XmlSerializer serializer = new XmlSerializer(engineerFormData.GetType());
            serializer.Serialize(XmlWriter, engineerFormData);

            //write XML string to file
            System.IO.File.WriteAllText($"{engineerFormData.Date} {engineerFormData.AddressLineOne}.xml", XmlWriter.ToString());
        }

        private static bool GenerateAndSendEmail(FormData engineerFormData)
        {
            // Using FluentEmail nuget package
            // This is not configured to send an actual email - you would normally have to initialise an email server.
            // This just errors - but the logic is there!
            var email = Email
                .From("BookingService@AlexanderDennis.co.uk")
                .To("Engineers@AlexanderDennis.co.uk")
                .Subject($"New Booking on {engineerFormData.Date} at {engineerFormData.TimeSlot}.")
                .Body(engineerFormData.GenerateEmailBody())
                .Send();
            if (email.Successful)
            {
                return true;
            }
            else
            {
                return false;
            }
            
        }
    }
}
