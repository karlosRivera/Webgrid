using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebGridSample.Models;
using System.Xml;
using System.Xml.Serialization;
using System.IO;
using System.Xml.Linq;

namespace WebGridSample.Utility
{
    public static class Utility
    {
        public static string GetXML(IList<Student> studentlist)
        {
            try
            {
                var xEle = new XElement("Employees",
                            from student in studentlist
                            select new XElement("Employee",
                                         new XAttribute("ID", emp.ID),
                                           new XElement("FName", emp.FName),
                                           new XElement("LName", emp.LName),
                                           new XElement("DOB", emp.DOB),
                                           new XElement("Sex", emp.Sex)
                                       ));

                xEle.Save("D:\\employees.xml");
                Console.WriteLine("Converted to XML");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}