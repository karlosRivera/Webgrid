using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Data;
using WebGridSample.Models;
using System;


namespace DataLayer.Repository
{
    public class StateRepository : AdoRepository<State>
    {
        public int DataCounter { get; set; }
        public bool hasError { get; set; }
        public string ErrorMessage { get; set; }

        public StateRepository(string connectionString)
            : base(connectionString)
        {
        }

        public IEnumerable<State> GetAll()
        {
            // DBAs across the country are having strokes 
            //  over this next command!
            using (var command = new SqlCommand("SELECT ID, StateName FROM State"))
            {
                return GetRecords(command);
            }
        }

        public State GetStateById(string id)
        {
            // PARAMETERIZED QUERIES!
            using (var command = new SqlCommand("SELECT ID, StateName FROM State WHERE Id = @id"))
            {
                command.Parameters.Add(new ObjectParameter("id", id));
                return GetRecord(command);
            }
        }

        public override State PopulateRecord(SqlDataReader reader)
        {
            return new State
            {
                ID = Convert.ToInt32(reader["ID"].ToString()),
                Name = reader["StateName"].ToString()
            };
        }

        public override void Status(bool IsError, string strErrMsg)
        {
            hasError = IsError;
            ErrorMessage = strErrMsg;
        }
    }
}