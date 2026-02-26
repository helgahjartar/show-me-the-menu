using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShowMeTheMenu.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AppSettings",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "WeeklyMenus",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Recipes",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "AppSettings",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_WeeklyMenus_UserId",
                table: "WeeklyMenus",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_UserId",
                table: "Recipes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSettings_UserId",
                table: "AppSettings",
                column: "UserId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_WeeklyMenus_UserId",
                table: "WeeklyMenus");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_UserId",
                table: "Recipes");

            migrationBuilder.DropIndex(
                name: "IX_AppSettings_UserId",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "WeeklyMenus");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Recipes");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AppSettings");

            migrationBuilder.InsertData(
                table: "AppSettings",
                columns: new[] { "Id", "AnthropicApiKey", "UpdatedAt" },
                values: new object[] { 1, null, new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) });
        }
    }
}
