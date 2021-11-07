using MySql.Data.MySqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

public class CsData
{
    public static string QWatchDB = ConfigurationManager.ConnectionStrings["MyEntities"].ConnectionString;
    public static string AttendanceDB = ConfigurationManager.ConnectionStrings["MyAttendance"].ConnectionString;
    public static string FIDB = ConfigurationManager.ConnectionStrings["MyFI"].ConnectionString;

    public static string LstQuotaSP = "";

    public static int Execute(string sqlStatement, CommandType cmdType, SortedList sqlPara, 
        EnumConnection enumConnection = EnumConnection.QWatchDB, string fiDBName = "")
    {
        int affected = -1;
        try
        {

            var connection = QWatchDB;
            if (enumConnection == EnumConnection.AttendanceDB)
                connection = AttendanceDB;
            if (enumConnection == EnumConnection.FIDB)
                connection = FIDB;

            connection = PDPA.DecryptString(connection);
            if (!string.IsNullOrEmpty(fiDBName))
                connection += ";database=" + fiDBName;

            using (MySqlConnection ctx = new MySqlConnection(connection))
            {
                ctx.Open();
                using (var cmd = new MySqlCommand(sqlStatement, ctx))
                {
                    cmd.CommandType = cmdType;
                    foreach (DictionaryEntry dPara in sqlPara)
                    {
                        cmd.Parameters.AddWithValue(dPara.Key.ToString(), dPara.Value);
                    }

                    //string retVal = "@result";
                    //cmd.Parameters.AddWithValue(retVal, MySqlDbType.Int32);
                    //cmd.Parameters.AddWithValue(retVal, MySqlDbType.Int64);
                    //cmd.Parameters[retVal].Direction = ParameterDirection.Output;

                    cmd.CommandTimeout = 90;
                    cmd.ExecuteNonQuery();
                    //affected = Convert.ToInt32(cmd.Parameters[retVal].Value);
                }
            }
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return affected;
    }

    public static DataTable GetDataTable(string sqlStatement, CommandType cmdType, SortedList sqlPara, 
        EnumConnection enumConnection = EnumConnection.QWatchDB, string fiDBName = "")
    {
        var result = new DataTable();

        try
        {
            var connection = QWatchDB;
            if (enumConnection == EnumConnection.AttendanceDB)
                connection = AttendanceDB;
            if (enumConnection == EnumConnection.FIDB)
                connection = FIDB;

            connection = PDPA.DecryptString(connection);
            if (!string.IsNullOrEmpty(fiDBName))
                connection += ";database=" + fiDBName;

            using (MySqlConnection ctx = new MySqlConnection(connection))
            {
                ctx.Open();
                using (var cmd = new MySqlCommand(sqlStatement, ctx))
                {
                    cmd.CommandType = cmdType;
                    foreach (DictionaryEntry dPara in sqlPara)
                    {
                        cmd.Parameters.AddWithValue(dPara.Key.ToString(), dPara.Value);
                    }

                    MySqlDataAdapter da = new MySqlDataAdapter(cmd);
                    da.Fill(result);
                }
            }
        }
        catch (Exception ex)
        {
            throw new Exception(ex.Message);
        }

        return result;
    }

    public static object ExecuteQryScalarSP(String spname, SortedList parameters, 
        EnumConnection enumConnection = EnumConnection.QWatchDB)
    {
        object rtnValue = null;

        try
        {
            var conn = QWatchDB;
            if (enumConnection == EnumConnection.AttendanceDB)
                conn = AttendanceDB;
            if (enumConnection == EnumConnection.FIDB)
                conn = FIDB;

            conn = PDPA.DecryptString(conn);

            using (MySqlConnection connection = new MySqlConnection(conn))
            using (MySqlCommand cmd = new MySqlCommand(spname, connection))
            {
                connection.Open();

                cmd.CommandType = CommandType.StoredProcedure;
                foreach (DictionaryEntry dPara in parameters)
                {
                    cmd.Parameters.AddWithValue(dPara.Key.ToString(), dPara.Value);
                }

                rtnValue = cmd.ExecuteScalar();

                connection.Close();
            }
        }
        catch (Exception ex)
        {

        }

        return rtnValue;
    }

    public static string ConvertDataTableTo_JSON_String(DataTable dataTable)
    {
        string str = string.Empty;
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer() { MaxJsonLength = 86753090 };
        List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();
        Dictionary<String, Object> row;
        try
        {
            foreach (DataRow dr in dataTable.Rows)
            {
                row = new Dictionary<String, Object>();
                foreach (DataColumn col in dataTable.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                tableRows.Add(row);
            }
            str = serializer.Serialize(tableRows);
        }
        catch
        {
            str = serializer.Serialize(string.Empty);
        }

        return str;
    }

    public static string DataTransfer(DataTable dt)
    {
        dt.Columns.Add("Transferred", typeof(string));

        string str = string.Empty;
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer() { MaxJsonLength = 86753090 };
        List<Dictionary<String, Object>> tableRows = new List<Dictionary<String, Object>>();
        Dictionary<String, Object> row;
        try
        {
            foreach (DataRow dr in dt.Rows)
            {
                int campaignCode = Convert.ToInt32(dr["CampaignCode"]);
                string campaignName = dr["CampaignName"].ToString();
                int clientID = Convert.ToInt32(dr["CMPrimairy"]);
                string extension = dr["CHChannelNo"].ToString();

                string query = "select * from tblSourcePositive where SP_Campaigncode = " + campaignCode +
                " and SP_CampaignName = '" + campaignName + "'" +
                " and SP_ClientCode = " + clientID +
                " and SP_Extension = '" + extension + "'";

                var exist = GetDataTable(query, CommandType.Text, new SortedList());
                if (exist.Rows.Count > 0)
                {
                    dr["Transferred"] = "1";
                }
                else
                {
                    dr["Transferred"] = "0";
                }
                dr.AcceptChanges();

                row = new Dictionary<String, Object>();
                foreach (DataColumn col in dt.Columns)
                {
                    row.Add(col.ColumnName, dr[col]);
                }
                tableRows.Add(row);
            }
            str = serializer.Serialize(tableRows);
        }
        catch
        {
            str = serializer.Serialize(string.Empty);
        }

        return str;
    }
}

public enum EnumConnection
{
    QWatchDB = 0,
    AttendanceDB = 1,
    FIDB = 2
}

public enum EnumAudit
{
    Audit = 1,
    Recovery = 2,
    Dialect = 3,
    Hold = 4
}