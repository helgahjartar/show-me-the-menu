using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShowMeTheMenu.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddKronanApiKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "KronanApiKey",
                table: "AppSettings",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KronanApiKey",
                table: "AppSettings");
        }
    }
}
