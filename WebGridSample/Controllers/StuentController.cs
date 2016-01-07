using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebGridSample.Models;
using DataLayer.Repository;
using WebGridSample.Utility;

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
            if (Request.IsAjaxRequest())
                System.Threading.Thread.Sleep(1000); // just simulate delay of one second

            StudentListViewModel SVm = new StudentListViewModel();
            SVm.Students = _Studentdata.GetStudents(oSVm.page, oSVm.PageSize, SVm.sort, oSVm.sortdir).ToList();
            SVm.SetUpParams(oSVm);
            SVm.States = _Statedata.GetAll().ToList();
            SVm.Cities = _Citydata.GetAll().ToList();
            SVm.RowCount = _Studentdata.DataCounter;
            return View("ListStudents",SVm);
        }

        [HttpPost]
        public ActionResult UpdateStudents(StudentListViewModel oSVm)
        {
            //System.Threading.Thread.Sleep(1000); // just simulate delay of one second
            StudentListViewModel SVm = new StudentListViewModel();
            SVm.SetUpParams(oSVm);
            //SVm.Students = _Studentdata.SaveXML(new List<Student>(oSVm.Students).ToXml("Students"), SVm.StartIndex, SVm.EndIndex, SVm.sort, SVm.sortdir).ToList();

            

            //Student Ost = new Student();
            //Ost.ID = 1;
            //Ost.FirstName = "test";
            //Ost.LastName = "test111";
            //Ost.IsActive = true;
            //Ost.StateID = 1;
            //Ost.StateName = null;
            //Ost.CityID = 2;
            //Ost.CityName = null;
            //string str = Ost.ToXml("Students");

            return View("ListStudents", SVm);
        }

    }
}