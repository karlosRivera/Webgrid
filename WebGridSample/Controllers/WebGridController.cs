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
        public ActionResult Show(StudentVm oSVm)
        {
            StudentVm SVm = new StudentVm(); //.GetStudents(oSVm);
            SVm.Students= SVm.GetStudents(oSVm);
            return View(SVm);
        }
    }

    
}