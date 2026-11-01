FROM mcr.microsoft.com/dotnet/sdk:10.0

LABEL org.opencontainers.image.source="https://github.com/Team-Decipher/onboardFlow"

ENV DOTNET_NOLOGO=1 \
    DOTNET_CLI_TELEMETRY_OPTOUT=1 \
    DOTNET_SKIP_FIRST_TIME_EXPERIENCE=1 \
    NUGET_PACKAGES=/nuget

# Shared NuGet cache (mounted as a named volume) must be writable by a non-root user.
# dotnet-ef is pinned to the same major version as the SDK.
RUN mkdir -p /nuget && chmod 777 /nuget \
 && dotnet tool install dotnet-ef --version "10.*" --tool-path /usr/local/bin

WORKDIR /app
EXPOSE 8080
