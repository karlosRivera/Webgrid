using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGridSample.Models;
using DataLayer.Repository;

namespace WebGridSample.Controllers
{
    public class WebGrid_Sample3Controller : Controller
    {
        private StudentRepository _data;

        public WebGrid_Sample3Controller()
        {
            _data = new StudentRepository(System.Configuration.ConfigurationManager.ConnectionStrings["StudentDBContext"].ConnectionString);
        }

        // GET: WebGrid_Sample3
        public ActionResult Show3(StudentVm oSVm)
        {
            System.Threading.Thread.Sleep(1000); // just simulate delay of one second
            StudentVm SVm = new StudentVm();
            SVm.Students = SVm.GetStudents(oSVm);
            return View(SVm);
        }

        public ActionResult List(StudentVm oSVm)
        {
            System.Threading.Thread.Sleep(1000); // just simulate delay of one second
            StudentVm SVm = new StudentVm();
            SVm.SetUpParams(oSVm);
            SVm.StudentList = _data.GetStudents(SVm.StartIndex, SVm.EndIndex, SVm.sort, oSVm.sortdir);
            SVm.RowCount = _data.DataCounter;
            return View("Show3",SVm);
        }
    }
}