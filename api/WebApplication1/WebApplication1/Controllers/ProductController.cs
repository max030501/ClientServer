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
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        public ProductController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }
        [HttpGet]
        public JsonResult Get()
        {
            string query = @"select id, name,description,price,image,idCategory from dbo.Product";
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
        public JsonResult Post(Product p)
        {
            string query = @"insert into dbo.Product values (@name,@description,@price,@image,@idCategory)";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("AppCon");
            SqlDataReader reader;
            using (SqlConnection conn = new SqlConnection(sqlDataSource))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@name", p.name);
                    cmd.Parameters.AddWithValue("@description", p.description);
                    cmd.Parameters.AddWithValue("@price", p.price);
                    cmd.Parameters.AddWithValue("@image", p.image);
                    cmd.Parameters.AddWithValue("@idCategory", p.idCategory);
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
            return new JsonResult("Product was created");
        }
        [HttpPut]
        public JsonResult Put(Product p)
        {
            string query = @"update dbo.Product set name=@name,description=@description,image=@image,price=@price,idCategory=@idCategory where id=@id";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("AppCon");
            SqlDataReader reader;
            using (SqlConnection conn = new SqlConnection(sqlDataSource))
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@name", p.name);
                    cmd.Parameters.AddWithValue("@description", p.description);
                    cmd.Parameters.AddWithValue("@price", p.price);
                    cmd.Parameters.AddWithValue("@image", p.image);
                    cmd.Parameters.AddWithValue("@idCategory", p.idCategory);
                    cmd.Parameters.AddWithValue("@id", p.id);
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
            return new JsonResult(p.id + " product was updated");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string query = @"delete from dbo.Product where id=@id";
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
            return new JsonResult(id + " product was deleted");
        }
        [Route("save-image")]
        [HttpPost]
        public JsonResult SaveImage()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedImage = httpRequest.Files[0];
                string imagename = postedImage.FileName;
                var path = _env.ContentRootPath + "/Images/" + imagename;

                using(var stream = new FileStream(path, FileMode.Create))
                {
                    postedImage.CopyTo(stream);
                }
                return new JsonResult(imagename);

            }catch (Exception)
            {
                return new JsonResult("default.png");
            }
        }
    }
}

