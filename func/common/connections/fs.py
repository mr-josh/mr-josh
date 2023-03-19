import os
from collections import namedtuple
from datetime import datetime, timedelta
from azure.storage.blob import (
    ContainerClient,
    BlobClient,
    BlobSasPermissions,
    generate_blob_sas,
)

AzureCredentials = namedtuple(
    "Credentials",
    ["DefaultEndpointsProtocol", "AccountName", "AccountKey", "EndpointSuffix"],
)


def get_credentials() -> AzureCredentials:
    """Get credentials from connection string."""

    return AzureCredentials(
        *["=".join(c.split("=")[1:]) for c in os.environ["FS_CONNSTR"].split(";")]
    )


def get_container_client(container: str):
    return ContainerClient.from_connection_string(
        conn_str=os.environ["FS_CONNSTR"],
        container_name=container,
    )


def generate_sas_url(blob: BlobClient):
    sas = generate_blob_sas(
        account_name=str(blob.account_name),
        container_name=blob.container_name,
        blob_name=blob.blob_name,
        account_key=get_credentials().AccountKey,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.utcnow() + timedelta(minutes=10),
    )

    sas_url = (
        f"https://{blob.account_name}.blob.core.windows.net/"
        f"{blob.container_name}/{blob.blob_name}?{sas}"
    )

    return sas_url
