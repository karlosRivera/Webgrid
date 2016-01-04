using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGridSample.Models;
using DataLayer.Repository;

namespace WebGridSample.Controllers
{
    public class StudentController : Controller
    {
        private StudentRepository _Studentdata;
        private StateRepository _Statedata;
        private CityRepository _Citydata;

        public StudentController()
        {
            _Studentdata = new StudentRepository(System.Configuration.ConfigurationManager.ConnectionStrings["StudentDBContext"].ConnectionString);
            _Statedata = new StateRepository(System.Configuration.ConfigurationManager.ConnectionStrings["StudentDBContext"].ConnectionString);
            _Citydata = new CityRepository(System.Configuration.ConfigurationManager.ConnectionStrings["StudentDBContext"].ConnectionString);
        }

        // GET: Stuent
        public ActionResult List(StudentListViewModel oSVm)
        {
            System.Threading.Thread.Sleep(1000); // just simulate delay of one second
            StudentListViewModel SVm = new StudentListViewModel();
            SVm.SetUpParams(oSVm);
            SVm.Students = _Studentdata.GetStudents(SVm.StartIndex, SVm.EndIndex, SVm.sort, oSVm.sortdir).ToList();
            SVm.States = _Statedata.GetAll().ToList();
            SVm.Cities = _Citydata.GetAll().ToList();
            SVm.RowCount = _Studentdata.DataCounter;

            return View("ListStudents",SVm);
        }

    }
}