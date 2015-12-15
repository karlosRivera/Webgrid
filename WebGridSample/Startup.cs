using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebGridSample.Startup))]
namespace WebGridSample
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
    }
}
