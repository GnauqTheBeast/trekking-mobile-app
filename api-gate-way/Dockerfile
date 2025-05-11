FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["OcelotGateway/OcelotGateway.csproj", "OcelotGateway/"]
RUN dotnet restore "OcelotGateway/OcelotGateway.csproj"

# Copy the rest of the code
COPY . .

# Build and publish
RUN dotnet build "OcelotGateway/OcelotGateway.csproj" -c Release -o /app/build
RUN dotnet publish "OcelotGateway/OcelotGateway.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "OcelotGateway.dll"] 