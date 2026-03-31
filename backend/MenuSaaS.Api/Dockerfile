FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["MenuSaaS.Api.csproj", "./"]
RUN dotnet restore "MenuSaaS.Api.csproj"

COPY . .
RUN dotnet publish "MenuSaaS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MenuSaaS.Api.dll"]