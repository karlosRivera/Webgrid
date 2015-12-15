using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace WebGridSample.Models
{
    public class Student
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }

        public IList<Student> GetStudents()
        {
            string connectionStringName = System.Configuration.ConfigurationManager.ConnectionStrings["StudentDBContext"].ConnectionString;
            IList<Student> _Student = new List<Student>();

            using (SqlConnection connection = new SqlConnection(connectionStringName))
            {
                SqlCommand command = new SqlCommand(
                  "SELECT ID, FirstName,LastName,IsActive FROM Student;", connection);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        _Student.Add(new Student()
                        {
                            ID = Convert.ToInt32(reader["ID"].ToString()),
                            FirstName = reader["FirstName"].ToString(),
                            LastName = reader["LastName"].ToString(),
                            IsActive = Convert.ToBoolean(reader["IsActive"])
                        });
                    }
                }
                reader.Close();
            }

            return _Student;
        }

        

        public Student()
        {
        }
    }
}