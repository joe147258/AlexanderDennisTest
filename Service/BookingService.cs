using AlexanderDennisTest.Database;
using AlexanderDennisTest.Domain;
using FluentEmail.Core;
using Newtonsoft.Json;

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
            DbConnector.StoreEngineerBooking(engineerFormData);
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

        public static string[] GetTimeSlotsFromDate(string date)
        {
            return DbConnector.GetBookedTimeSlots(date);
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
