using AlexanderDennisTest.Domain;
using Microsoft.Data.SqlClient;
using Microsoft.SqlServer.Server;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Globalization;
using System.Linq;

namespace AlexanderDennisTest.Database
{
    public class DatabaseConnector
    {
        private SqlConnection connection;

        public DatabaseConnector()
        {
            string connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("Database")["ConnectionString"]; ;
            connection = new SqlConnection(connectionString);
            connection.Open();
        }

        public bool StoreEngineerBooking(FormData formData)
        {
            string query = "INSERT INTO EngineerTable (AddressLineOne, AddressLineTwo, City, County, PostCode, FirstName, LastName, Email, ContactNumber, " +
                "JobCategory, BookingDate, TimeSlot, Comment, Registration) VALUES (@addressLineOne,@addressLineTwo, @city, @county, @postCode, @firstName," +
                " @lastName, @email, @contactNumber, @jobCategory, @bookingDate, @timeSlot, @comment, @registration);";
            try
            {
                using SqlCommand cmd = new SqlCommand(query, connection);

                // This should sanitise all inputs.
                cmd.Parameters.AddWithValue("@addressLineOne", formData.AddressLineOne);
                cmd.Parameters.AddWithValue("@addressLineTwo", formData.AddressLineTwo);
                cmd.Parameters.AddWithValue("@city", formData.City);
                cmd.Parameters.AddWithValue("@county", formData.County);
                cmd.Parameters.AddWithValue("@postCode", formData.PostCode);
                cmd.Parameters.AddWithValue("@firstName", formData.FirstName);
                cmd.Parameters.AddWithValue("@lastName", formData.LastName);
                cmd.Parameters.AddWithValue("@email", formData.Email);
                cmd.Parameters.AddWithValue("@contactNumber", formData.ContactNumber);
                cmd.Parameters.AddWithValue("@jobCategory", formData.JobCategory.ToString());
                cmd.Parameters.AddWithValue("@bookingDate", formData.Date);
                cmd.Parameters.AddWithValue("@timeSlot", formData.TimeSlot);
                cmd.Parameters.AddWithValue("@comment", formData.Comment);
                cmd.Parameters.AddWithValue("@registration", formData.Registration);
                cmd.ExecuteNonQuery();
            }
            catch (SqlException)
            {
                return false;
            }

            return true;
        }

        public string GetAllBookingsJson()
        {
            string query = "SELECT * FROM EngineerTable;";
            using SqlCommand cmd = new SqlCommand(query, connection);

            List<object> objects = new List<object>();

            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    IDictionary<string, object> record = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        record.Add(reader.GetName(i), reader[i]);
                    }
                    objects.Add(record);
                }
            }
            return JsonConvert.SerializeObject(objects);
        }

        public string GetDatabaseBooking(int id)
        {
            string query = "SELECT * FROM EngineerTable WHERE id = @id;";
            using SqlCommand cmd = new SqlCommand(query, connection);
            cmd.Parameters.AddWithValue("@id", id);
            List<object> objects = new List<object>();

            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    IDictionary<string, object> record = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        record.Add(reader.GetName(i), reader[i]);
                    }
                    objects.Add(record);
                }
            }
            return JsonConvert.SerializeObject(objects);
        }

        public string[] GetFullyBookedTimeSlots(string date)
        {
            string command = $"SELECT * FROM FullyBookedTimesTable WHERE BookingDate = \'{date}\'";
            using SqlCommand cmd = new SqlCommand(command, connection);

            List<string> usedTimeSlots = new List<string>();
            using (SqlDataReader reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    usedTimeSlots.Add(reader["TimeSlot"].ToString());

                }
            }
            return usedTimeSlots.ToArray();
        }
    }
}
