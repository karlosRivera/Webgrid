using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Data;
using WebGridSample.Models;
using System;


namespace DataLayer.Repository
{
    public class CityRepository : AdoRepository<City>
    {
        public int DataCounter { get; set; }
        public bool hasError { get; set; }
        public string ErrorMessage { get; set; }

        public CityRepository(string connectionString)
            : base(connectionString)
        {
        }

        public IEnumerable<City> GetAll()
        {
            // DBAs across the country are having strokes 
            //  over this next command!
            using (var command = new SqlCommand("SELECT ID, CityName,StateID FROM City"))
            {
                return GetRecords(command);
            }
        }

        public City GetById(string id)
        {
            // PARAMETERIZED QUERIES!
            using (var command = new SqlCommand("SELECT ID, CityName FROM City WHERE Id = @id"))
            {
                command.Parameters.Add(new ObjectParameter("id", id));
                return GetRecord(command);
            }
        }

        public City GetCityByStateId(string stateid)
        {
            // PARAMETERIZED QUERIES!
            using (var command = new SqlCommand("SELECT ID, CityName FROM City WHERE StateId = @stateid"))
            {
                command.Parameters.Add(new ObjectParameter("StateId", stateid));
                return GetRecord(command);
            }
        }

        public override City PopulateRecord(SqlDataReader reader)
        {
            return new City
            {
                ID = Convert.ToInt32(reader["ID"].ToString()),
                Name = reader["CityName"].ToString(),
                StateID = Convert.ToInt32(reader["StateId"].ToString())
            };
        }

        public override void Status(bool IsError, string strErrMsg)
        {
            hasError = IsError;
            ErrorMessage = strErrMsg;
        }

    }
}