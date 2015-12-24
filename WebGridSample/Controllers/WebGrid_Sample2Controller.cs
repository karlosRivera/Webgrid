using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGridSample.Models;

namespace WebGridSample.Controllers
{
    public class WebGrid_Sample2Controller : Controller
    {
        // GET: WebGrid_Sample2
        public ActionResult Show2(StudentVm oSVm)
        {
            StudentVm SVm = new StudentVm(); 
            SVm.Students = SVm.GetStudents(oSVm);
            return View(SVm);
        }

    }
}
