import os
from azure.storage.blob import ContainerClient


def get_container_client(container: str):
    return ContainerClient.from_connection_string(
        conn_str=os.environ["FS_CONNSTR"],
        container_name=container,
    )
