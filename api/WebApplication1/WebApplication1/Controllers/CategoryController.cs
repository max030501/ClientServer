using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public CategoryController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public JsonResult Get()
        {
            string query = @"select id, name from dbo.Category";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("AppCon");
            SqlDataReader reader;
            using (SqlConnection conn = new SqlConnection(sqlDataSource))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                 
                    try
                    {
                        reader = cmd.ExecuteReader();
                        table.Load(reader);
                        reader.Close();
                    }
                    catch (Exception e)
                    {
                        return new JsonResult(e.ToString());
                    }
                }
                conn.Close();
            }
            return new JsonResult(table);
        }

        [HttpPost]
        public JsonResult Post(Category c)
        {
            string query = @"insert into dbo.Category values (@name)";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("AppCon");
            SqlDataReader reader;
            using (SqlConnection conn = new SqlConnection(sqlDataSource))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@name", c.name);
                    try
                    {
                        reader = cmd.ExecuteReader();
                        table.Load(reader);
                        reader.Close();
                    }
                    catch (Exception e)
                    {
                        return new JsonResult(e.ToString());
                    }
                }
                conn.Close();
            }
            return new JsonResult("Category was created");
        }
        [HttpPut]
        public JsonResult Put(Category c)
        {
            string query = @"update dbo.Category set name=@name where id=@id";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("AppCon");
            SqlDataReader reader;
            using (SqlConnection conn = new SqlConnection(sqlDataSource))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@name", c.name);
                    cmd.Parameters.AddWithValue("@id", c.id);
                    try
                    {
                        reader = cmd.ExecuteReader();
                        table.Load(reader);
                        reader.Close();
                    }
                    catch (Exception e)
                    {
                        return new JsonResult(e.ToString());
                    }
                }
                conn.Close();
            }
            return new JsonResult(c.id + " category was updated");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"delete from dbo.Category where id=@id";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("AppCon");
            SqlDataReader reader;
            using (SqlConnection conn = new SqlConnection(sqlDataSource))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    try
                    {
                        reader = cmd.ExecuteReader();
                        table.Load(reader);
                        reader.Close();
                    }
                    catch (Exception e)
                    {
                        return new JsonResult(e.ToString());
                    }
                       
                }
                conn.Close();
            }
            return new JsonResult(id+" category was deleted");
        }
    }
}
