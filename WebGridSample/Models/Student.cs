using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace WebGridSample.Models
{
    public class StudentVm
    {
        public int page = 0, RowCount = 0;
        public string sort = "", sortdir = "";
        public int PageSize = 10;
        public IList<Student> Students { get; set; }


        public IList<Student> GetStudents(StudentVm oSVm)
        {
            int StartIndex = 0, EndIndex = 0;

            if (oSVm.page == 0)
                page = 1;

            StartIndex = ((oSVm.page * oSVm.PageSize) - oSVm.PageSize) + 1;
            EndIndex = (oSVm.page * oSVm.PageSize);

            if (oSVm.sort == "")
                oSVm.sort = "ID";

            if (oSVm.sortdir == "")
                oSVm.sortdir = "ASC";

            string connectionStringName = System.Configuration.ConfigurationManager.ConnectionStrings["StudentDBContext"].ConnectionString;
            IList<Student> _Student = new List<Student>();

            string strSQL = "SELECT ID, FirstName,LastName,IsActive FROM Student WHERE ID >=" + StartIndex+ " AND ID <="+ EndIndex;
            strSQL += " ORDER BY " + oSVm.sort + " " + oSVm.sortdir;

            using (SqlConnection connection = new SqlConnection(connectionStringName))
            {
                SqlCommand command = new SqlCommand(
                  ";", connection);

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
            RowCount = _Student.Count;
            return _Student;
        }
    }

    public class Student
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }
    }
}