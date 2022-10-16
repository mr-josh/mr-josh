// TODO: Create a form for uploading art

import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Input,
  Modal,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

import AutoLinkIcon from "components/auto-link-icon";
import { IconUpload } from "@tabler/icons";
import { showNotification } from "@mantine/notifications";
import style from "./style.module.css";
import { useForm } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ArtUpload {
  title: string;
  creator: string;
  social1: string;
  social2: string;
  social3: string;
  data: File | null;
}

interface Art {
  id: string;
  title: string;
  creator: string;
  socials: string[];
  url: string;
}

const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};

const ArtPage = () => {
  const [openedImage, setOpenedImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [openedUpload, setOpenedUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  const form = useForm<ArtUpload>({
    initialValues: {
      title: "",
      creator: "",
      social1: "",
      social2: "",
      social3: "",
      data: null,
    },
  });

  const openImage = (image: string) => {
    setSelectedImage(image);
    setOpenedImage(true);
  };

  const uploadArt = async (values: ArtUpload) => {
    if (uploading) return;

    setUploading(true);
    let socials = [values.social1, values.social2, values.social3];

    socials = socials.filter((social) => !!social);

    let request = await fetch("https://www.mr-josh.com/api/art", {
      method: "POST",
      body: JSON.stringify({
        title: values.title,
        creator: values.creator || "Anonymous",
        socials: socials,
        data: await fileToBase64(values.data as File),
      }),
    });

    if (!request.ok) {
      showNotification({
        title: "Error",
        message: "An error occurred while uploading your art :(",
        color: "red",
      });
    } else {
      showNotification({
        title: "Success",
        message:
          "Your art has been uploaded! It will show on the board once approved :)",
        color: "green",
      });
    }

    form.reset();
    setOpenedUpload(false);

    setUploading(false);
  };

  const { data } = useQuery<Art[]>(["art"], async () => {
    const res = await fetch("https://www.mr-josh.com/api/art");

    return await res.json();
  });

  return (
    <>
      <Modal
        title="Oh wow, pretty art!"
        opened={openedImage}
        onClose={() => setOpenedImage(false)}
        centered
      >
        <Image src={selectedImage} />
      </Modal>
      <Modal
        title="Upload Art"
        opened={openedUpload}
        onClose={() => setOpenedUpload(false)}
        centered
      >
        <form onSubmit={form.onSubmit(uploadArt)}>
          <Group position="apart">
            <TextInput
              label="Title"
              maxLength={50}
              required
              {...form.getInputProps("title")}
            />
            <TextInput
              label="Creator Name"
              maxLength={25}
              {...form.getInputProps("creator")}
            />
          </Group>
          <Input.Wrapper label="Art" required>
            <Dropzone
              onDrop={(files) => {
                form.setFieldValue("data", files[0]);
              }}
              onReject={(files) => {
                alert("Invalid file");
              }}
              accept={IMAGE_MIME_TYPE}
            >
              <Text>Upload files</Text>
            </Dropzone>
            {form.values.data && (
              <Text>
                {form.values.data.name} ({form.values.data.size} bytes)
              </Text>
            )}
          </Input.Wrapper>
          <Group position="apart" grow>
            <TextInput
              label="Social 1"
              maxLength={500}
              {...form.getInputProps("social1")}
            />
            <TextInput
              label="Social 2"
              maxLength={500}
              {...form.getInputProps("social2")}
            />
            <TextInput
              label="Social 3"
              maxLength={500}
              {...form.getInputProps("social3")}
            />
          </Group>
          <Space h="sm" />
          <Button type="submit" fullWidth loading={uploading}>
            Upload
          </Button>
        </form>
      </Modal>
      <div className={style.art}>
        <div className={style.feed}>
          <div className={style.board}>
            {data &&
              data.map((art, i) => {
                return (
                  <Card key={i} shadow="md" radius="md" withBorder>
                    <Card.Section
                      component="a"
                      className={style.artPreview}
                      onClick={() => openImage(art.url)}
                    >
                      <Image src={art.url} alt={art.title} height="14rem" />
                    </Card.Section>
                    <Space h="md" />
                    <div className={style.artTop}>
                      <Text>{art.title}</Text>
                      <div className={style.socials}>
                        {art.socials
                          .filter((s) => !!s)
                          .map((social, i) => (
                            <a
                              className={style.social}
                              href={social}
                              target="_blank"
                              key={i}
                            >
                              <AutoLinkIcon url={social} />
                            </a>
                          ))}
                      </div>
                    </div>
                    <Text size="sm">{art.creator}</Text>
                  </Card>
                );
              })}
          </div>
        </div>
        <ActionIcon
          className={style.uploadButton}
          variant="filled"
          color="teal"
          onClick={() => setOpenedUpload(true)}
        >
          <IconUpload />
        </ActionIcon>
      </div>
    </>
  );
};

export default ArtPage;
