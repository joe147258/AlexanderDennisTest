using AlexanderDennisTest.Domain;
using Microsoft.Data.SqlClient;
namespace AlexanderDennisTest.Database
{
    public class DatabaseConnector
    {
        private SqlConnection connection;

        public DatabaseConnector()
        {
            string connectionString = @"Server=localhost\SQLEXPRESS;Database=AlexanderDennis;TrustServerCertificate=True;Trusted_Connection=True;";
            connection = new SqlConnection(connectionString);
            connection.Open();
        }

        public bool StoreEngineerBooking(FormData formData)
        {
            string command = "INSERT INTO EngineerTable (AddressLineOne, AddressLineTwo, City, County, PostCode, FirstName, LastName, Email, ContactNumber, JobCategory, BookingDate, TimeSlot, Comment, Registration) " +
                $"VALUES (\'{formData.AddressLineOne}\', \'{formData.AddressLineTwo}\', \'{formData.City}\', \'{formData.County}\', \'{formData.PostCode}\', \'{formData.FirstName}\', \'{formData.LastName}\', \'{formData.Email}\', \'{formData.ContactNumber}\', \'{formData.JobCategory}\', \'{formData.Date}\', \'{formData.TimeSlot}\', \'{formData.Comment}\', \'{formData.Registration}\');";
            System.Diagnostics.Debug.WriteLine(command);
            try
            {
                using SqlCommand cmd = new SqlCommand(command, connection);
                cmd.ExecuteNonQuery();
            }
            catch (SqlException)
            {
                System.Diagnostics.Debug.WriteLine("here - error!");
                return false;
            }
            System.Diagnostics.Debug.WriteLine("here - not error!");
            return true;
        }
    }
}
