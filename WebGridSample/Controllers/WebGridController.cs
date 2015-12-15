using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGridSample.Models;

namespace WebGridSample.Controllers
{
    public class WebGridController : Controller
    {
        // GET: WebGrid
        public ActionResult Show()
        {


            IList<Student> oStudent = new Student().GetStudents();
            return View(oStudent);
        }
    }

    
}