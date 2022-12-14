using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

namespace AlexanderDennisTest.Domain
{
    public class FormData
    {
        // I use readonly arrays here as it is easy to change and add values.
        // Const array with the properties that are allowed to be null.
        private static readonly string[] AllowedNullOrEmptyFields = { "Comment", "County", "AddressLineTwo" };
        // Const array with the Monday and Wednesday Times.
        private static readonly string[] MondayAndWedesndayTimeSlots = { "8:00 - 10:00", "11:00 - 13:00", "14:00 - 16:00" };
        // Const array with the Tuesday and Thursday Times.
        private static readonly string[] TuesdayAndThursdayTimeSlots = { "9:00 - 11:00", "12:00 - 14:00", "15:00 - 17:00" };
        // Const array with the Friday Times.
        private static readonly string[] FridayTimeSlots = { "8:00 - 10:00", "11:00 - 13:00" };

        private static readonly Regex EmailRegex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
        private static readonly Regex ContactNumberRegex = new Regex(@"^(\+)?([ 0-9]){10,16}$");
        public enum JobCategoryEnum { warranty, breakdown, vehicleOfRoad }

        public string AddressLineOne { get; set; }
        public string AddressLineTwo { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string PostCode { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string ContactNumber { get; set; }
        public JobCategoryEnum JobCategory { get; set; }
        public string Date { get; set; }
        public string TimeSlot { get; set; }
        public string Comment { get; set; }
        public string Registration { get; set; }

        public string GenerateEmailBody()
        {
            StringBuilder emailBodyBuilder = new StringBuilder();
            emailBodyBuilder.Append($"You have received a new booking.");
            emailBodyBuilder.Append($"\nClient:\n{FirstName} {LastName}\n{Email}\n{ContactNumber}\n");
            emailBodyBuilder.Append($"Job Details:\nCatergory - {JobCategory.ToString()}\nVehicle Registration - {Registration}\nDate: {Date}\nTime: {TimeSlot}\nLocation: ");
            emailBodyBuilder.Append($"{AddressLineOne}, ");
            if (!AddressLineTwo.IsNullOrEmpty()) emailBodyBuilder.Append($"{AddressLineTwo}, ");
            emailBodyBuilder.Append($"{City}, ");
            if (!County.IsNullOrEmpty()) emailBodyBuilder.Append($"{County}, ");
            emailBodyBuilder.Append($"{PostCode}\n");
            emailBodyBuilder.Append("Client's additional comment:\n");
            if (!Comment.IsNullOrEmpty()) emailBodyBuilder.Append(Comment);
            else emailBodyBuilder.Append("N/A");
            return emailBodyBuilder.ToString();
        }

        public bool ValidateInput()
        {
            // Checks that no required property is empty.
            foreach (PropertyInfo pi in this.GetType().GetProperties())
            {
                if (pi.PropertyType == typeof(string))
                {
                    string value = (string)pi.GetValue(this);
                    if (string.IsNullOrEmpty(value))
                    {
                        if (!AllowedNullOrEmptyFields.Contains(pi.Name))
                        {
                            throw new ArgumentException(pi.Name + " is null or empty.");
                        }
                    }
                }
            }
            // Parse date into Object
            DateTime parsedDate = DateTime.Parse(Date);

            // Check date hasn't been passed as a weekday.
            if ((parsedDate.DayOfWeek == DayOfWeek.Saturday) || (parsedDate.DayOfWeek == DayOfWeek.Sunday))
            {
                throw new ArgumentException("Day of week is a weekend.");
            }

            // Check date is two days in the future
            DateTime minDate = DateTime.Now.AddDays(2);
            if (parsedDate.Date < minDate.Date)
            {
                throw new ArgumentException("Date is not 2 days in the future.");
            }

            // Ensure correct timeslots are available on certain day
            switch (parsedDate.DayOfWeek) 
            {
                case (DayOfWeek.Monday): case (DayOfWeek.Wednesday):
                    if (!MondayAndWedesndayTimeSlots.Contains(this.TimeSlot))
                    {
                        throw new ArgumentException("Incorrect times for Monday and Wednesday");
                    }
                    break;
                case (DayOfWeek.Tuesday): case (DayOfWeek.Thursday):
                    if (!TuesdayAndThursdayTimeSlots.Contains(this.TimeSlot))
                    {
                        throw new ArgumentException("Incorrect times for Tuesday and Thursday");
                    }
                    break;
                case (DayOfWeek.Friday):
                    if (!FridayTimeSlots.Contains(this.TimeSlot))
                    {
                        throw new ArgumentException("Incorrect times for Friday");
                    }
                    break;
            }

            // Validate Regex on email and contact number
            Match emailMatch = EmailRegex.Match(this.Email);
            if (!emailMatch.Success) throw new ArgumentException("Non valid email address.");

            Match contactNumberMatch = ContactNumberRegex.Match(this.ContactNumber);
            if (!contactNumberMatch.Success) throw new ArgumentException("Non valid contact number.");

            // No spaces in registration for uniformity
            if ((this.Registration.Contains(" ")) || (this.Registration.Length > 7))
            {
                throw new ArgumentException("Space in registration or is greater than 7 characters.");
            }

            if (Comment.Length > 255)
            {
                throw new ArgumentException("Comment is too long!");
            }

            return true;
        }
    }
}
