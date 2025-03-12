using Microsoft.OpenApi.Models;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Parks") ?? "Data Source=Parks.db";

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSqlite<ParksDb>(connectionString);

builder.Services.AddSwaggerGen(c =>
{
     c.SwaggerDoc("v1", new OpenApiInfo {
         Title = "Parks API",
         Description = "Where the dogs love to go",
         Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      builder =>
                      {
                          builder.WithOrigins("http://localhost:5173")
                            .AllowAnyHeader()
                            .AllowAnyMethod();;
                      });
});

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

if (app.Environment.IsDevelopment())
{
   app.UseSwagger();
   app.UseSwaggerUI(c =>
   {
      c.SwaggerEndpoint("/swagger/v1/swagger.json", "Parks API V1");
   });
}

app.MapGet("/", () => "Hello World!");

app.MapGet("/parks", async (ParksDb db) => await db.Parks.ToListAsync());
app.MapPost("/parks", async (ParksDb db, Park park) =>
{
    await db.Parks.AddAsync(park);
    await db.SaveChangesAsync();
    return Results.Created($"/park/{park.Id}", park);
});
app.MapGet("/park/{id}", async (ParksDb db, int id) => await db.Parks.FindAsync(id));
app.MapPut("/park/{id}", async (ParksDb db, Park updatePark, int id) =>
{
      var park = await db.Parks.FindAsync(id);
      if (park is null) return Results.NotFound();
      park.Name = updatePark.Name;
      park.Description = updatePark.Description;
      await db.SaveChangesAsync();
      return Results.NoContent();
});
app.MapDelete("/park/{id}", async (ParksDb db, int id) =>
{
   var park = await db.Parks.FindAsync(id);
   if (park is null)
   {
      return Results.NotFound();
   }
   db.Parks.Remove(park);
   await db.SaveChangesAsync();
   return Results.Ok();
});

app.Run();