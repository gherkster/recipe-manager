using System.Text.Json.Serialization;

namespace API.Models.Base;

public class DatabaseEntry
{
    /// <summary>
    /// Autogenerated ID which is hidden from endpoints
    /// </summary>
    [JsonIgnore]
    public Guid Id { get; set; } = Guid.NewGuid();
}