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
        public int page { get; set; }
        public int RowCount { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }

        public string sort { get; set; }
        public string sortdir { get; set; }

        public IList<Student> Students { get; set; }

        public StudentVm()
        {
            PageSize = 5;
            sort = "ID";
            sortdir = "ASC";
            CurrentPage = 1;
        }

        public IList<Student> GetStudents(StudentVm oSVm)
        {
            int StartIndex = 0, EndIndex = 0;

            if (oSVm.page == 0)
                oSVm.page = 1;

            StartIndex = ((oSVm.page * oSVm.PageSize) - oSVm.PageSize) + 1;
            EndIndex = (oSVm.page * oSVm.PageSize);
            CurrentPage = StartIndex;

            if (string.IsNullOrEmpty(oSVm.sort))
                oSVm.sort = "ID";

            if (string.IsNullOrEmpty(oSVm.sortdir))
                oSVm.sortdir = "ASC";

            string connectionStringName = System.Configuration.ConfigurationManager.ConnectionStrings["StudentDBContext"].ConnectionString;
            IList<Student> _Student = new List<Student>();

            string strSQL = "SELECT ID, FirstName,LastName,IsActive,StateName,CityName FROM vwListStudents WHERE ID >=" + StartIndex + " AND ID <=" + EndIndex;
            strSQL += " ORDER BY " + oSVm.sort + " " + oSVm.sortdir;

            strSQL += ";SELECT COUNT(*) AS Count FROM vwListStudents";
            using (SqlConnection connection = new SqlConnection(connectionStringName))
            {
                SqlCommand command = new SqlCommand(
                  strSQL, connection);

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
                            IsActive = Convert.ToBoolean(reader["IsActive"]),
                            StateName = reader["StateName"].ToString(),
                            CityName = reader["CityName"].ToString()
                        });
                    }
                }

                reader.NextResult();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        RowCount = Convert.ToInt32(reader["Count"].ToString());
                    }
                }

                reader.Close();
            }
            //RowCount = _Student.Count;
            return _Student;
        }
    }

    public class Student
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsActive { get; set; }
        public string StateName { get; set; }
        public string CityName { get; set; }
    }
}