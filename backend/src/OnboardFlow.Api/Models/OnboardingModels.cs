using System;
using System.Collections.Generic;

namespace OnboardFlow.Api.Models;

public enum StepStatus
{
    Pending,
    InReview,
    Approved
}

public class WorkflowStep
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending"; // "Approved", "In review", "Pending"
    public int Order { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime? CompletedAt { get; set; }
    public List<string> Documents { get; set; } = new();
}

public class OnboardingWorkflowResponse
{
    public string CaseId { get; set; } = "OBF-2026-904";
    public string ClientName { get; set; } = "Apex Global Advisory Partners";
    public string Headline { get; set; } = "Great partnerships start here.";
    public string Subtitle { get; set; } = "One place for your clients, documents and every step in between.";
    public string CardTitle { get; set; } = "A smoother start";
    public string Category { get; set; } = "CLIENT ONBOARDING & DOCUMENT WORKFLOW";
    public int ProgressPercentage { get; set; }
    public List<WorkflowStep> Steps { get; set; } = new();
}

public class UpdateStepStatusRequest
{
    public string Status { get; set; } = string.Empty; // "Approved", "In review", "Pending"
}
