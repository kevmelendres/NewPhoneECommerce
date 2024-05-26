using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations.Identity
{
    /// <inheritdoc />
    public partial class changeAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "State",
                table: "Address",
                newName: "Region");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Address",
                newName: "Province");

            migrationBuilder.AddColumn<string>(
                name: "Barangay",
                table: "Address",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Municipality",
                table: "Address",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Barangay",
                table: "Address");

            migrationBuilder.DropColumn(
                name: "Municipality",
                table: "Address");

            migrationBuilder.RenameColumn(
                name: "Region",
                table: "Address",
                newName: "State");

            migrationBuilder.RenameColumn(
                name: "Province",
                table: "Address",
                newName: "City");
        }
    }
}
