using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System;

namespace DataLayer.Repository
{
   public abstract class AdoRepository<T> where T : class
    {
        private SqlConnection _connection;
        public virtual void Status(bool IsError, string strErrMsg)
        {

        }

        public AdoRepository(string connectionString)
        {
            _connection = new SqlConnection(connectionString);
        }

        public virtual T PopulateRecord(SqlDataReader reader)
        {
            return null;
        }

        public virtual void GetDataCount(int count)
        {
           
        }

        protected IEnumerable<T> GetRecords(SqlCommand command)
        {
            var reader = (SqlDataReader) null;
            var list = new List<T>();
            try
            {
                command.Connection = _connection;
                _connection.Open();
                reader = command.ExecuteReader();
                while (reader.Read())
                {
                    list.Add(PopulateRecord(reader));
                }

                reader.NextResult();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        GetDataCount(Convert.ToInt32(reader["Count"].ToString()));
                    }
                }
                Status(false, "");
            }
            catch (Exception ex)
            {
                Status(true, ex.Message);
            }
            finally
            {
                // Always call Close when done reading.
                reader.Close();
                _connection.Close();
                _connection.Dispose();
            }

            return list;
        }

        protected T GetRecord(SqlCommand command)
        {
            var reader = (SqlDataReader)null;
            T record = null;

            try
            {
                command.Connection = _connection;
                _connection.Open();

                reader = command.ExecuteReader();
                while (reader.Read())
                {
                    record = PopulateRecord(reader);
                    Status(false, "");
                    break;
                }
            }
            catch (Exception ex)
            {
                Status(true, ex.Message);
            }
            finally
            {
                reader.Close();
                _connection.Close();
                _connection.Dispose();
            }
            return record;
        }

        protected IEnumerable<T> ExecuteStoredProc(SqlCommand command, string CountColName="TotalCount")
        {
            var reader = (SqlDataReader)null;
            var list = new List<T>();

            try
            {
                command.Connection = _connection;
                command.CommandType = CommandType.StoredProcedure;
                _connection.Open();
                reader = command.ExecuteReader();

                while (reader.Read())
                {
                    var record = PopulateRecord(reader);
                    if (record != null) list.Add(record);
                }

                reader.NextResult();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        GetDataCount(Convert.ToInt32(reader[CountColName].ToString()));
                    }
                }

            }
            finally
            {
                // Always call Close when done reading.
                reader.Close();
                _connection.Close();
                _connection.Dispose();
            }
            return list;
        }
    }
}

