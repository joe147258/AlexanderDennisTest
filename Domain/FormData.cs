namespace AlexanderDennisTest.Domain
{
    public class FormData
    {
        public FormData(string formData)
        { 
            
        }
        public enum JobCategoryEnum { warranty, breakdown, vechicleOnRoad }

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
        public static bool ValidateInput()
        {
            return true;
        }
    }
}
