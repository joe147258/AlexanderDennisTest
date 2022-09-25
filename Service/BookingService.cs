using AlexanderDennisTest.Database;
using AlexanderDennisTest.Domain;
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

            return true;
        }
    }
}
