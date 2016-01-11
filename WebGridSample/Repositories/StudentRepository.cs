using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Data;
using WebGridSample.Models;
using System;

namespace DataLayer.Repository
{
    public class StudentRepository : AdoRepository<Student>
    {
        public int DataCounter { get; set; }
        public bool hasError { get; set; }
        public string ErrorMessage { get; set; }

        public StudentRepository(string connectionString)
            : base(connectionString)
        {
        }

        public IEnumerable<Student> GetAll()
        {
            // DBAs across the country are having strokes 
            //  over this next command!
            using (var command = new SqlCommand("SELECT ID, FirstName,LastName,IsActive,StateName,CityName FROM vwListStudents"))
            {
                return GetRecords(command);
            }
        }
        public Student GetById(string id)
        {
            // PARAMETERIZED QUERIES!
            using (var command = new SqlCommand("SELECT ID, FirstName,LastName,IsActive,StateName,CityName FROM vwListStudents WHERE Id = @id"))
            {
                command.Parameters.Add(new ObjectParameter("id", id));
                return GetRecord(command);
            }
        }

        public IEnumerable<Student> SaveXML(string strXML, int PageNo,int PageSize,string SortCol,string SortOrder)
        {
            if (PageNo <= 0) PageNo = 1;

            using (var command = new SqlCommand("USP_SaveStudent"))
            {
                command.Parameters.Add("@Data", SqlDbType.VarChar,-1).Value = strXML;
                command.Parameters.Add("@PageNbr", SqlDbType.Int).Value = PageNo;
                command.Parameters.Add("@PageSize", SqlDbType.Int).Value = PageSize;
                command.Parameters.Add("@SortColumn", SqlDbType.VarChar, 20).Value = SortCol;
                command.Parameters.Add("@SortOrder", SqlDbType.VarChar, 4).Value = SortOrder;

                return ExecuteStoredProc(command);
            }
        }

        public IEnumerable<Student> GetStudents(int PageNo, int PageSize, string SortCol, string SortOrder)
        {
            //string strSQL = "SELECT * FROM vwListStudents WHERE ID >=" + StartIndex + " AND ID <=" + EndIndex;
            //strSQL += " ORDER BY " + sortCol + " " + sortOrder;
            //strSQL += ";SELECT COUNT(*) AS Count FROM vwListStudents";
            //var command = new SqlCommand(strSQL);
            //return GetRecords(command);
            if (PageNo <= 0) PageNo = 1;

            using (var command = new SqlCommand("USP_GetStudentData"))
            {
                command.Parameters.Add("@PageNbr", SqlDbType.Int).Value = PageNo;
                command.Parameters.Add("@PageSize",SqlDbType.Int).Value=  PageSize;
                command.Parameters.Add("@SortColumn", SqlDbType.VarChar, 20).Value = SortCol;
                command.Parameters.Add("@SortOrder", SqlDbType.VarChar, 4).Value = SortOrder;
                return ExecuteStoredProc(command);
            }
        }

        public override Student PopulateRecord(SqlDataReader reader)
        {
            return new Student
            {
                ID = Convert.ToInt32(reader["ID"].ToString()),
                FirstName = reader["FirstName"].ToString(),
                LastName = reader["LastName"].ToString(),
                IsActive = Convert.ToBoolean(reader["IsActive"]),
                StateID = Convert.ToInt32(reader["StateID"].ToString()),
                StateName = reader["StateName"].ToString(),
                CityID = Convert.ToInt32(reader["CityID"].ToString()),
                CityName = reader["CityName"].ToString()
            };
        }

        public override void GetDataCount(int count)
        {
            DataCounter = count;
        }

        public override void Status(bool IsError, string strErrMsg)
        {
            hasError = IsError;
            ErrorMessage = strErrMsg;
        }
    }
}