import { Button, Card, Group, rem, Stack, Text } from '@mantine/core'
import { Dropzone, FileRejection } from '@mantine/dropzone'
import { IconFile3d, IconUpload, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useAuth } from '@/contexts'
import { useCreateNewModelMutation, useCreateNewVersionMutation, useCreateProjectMutation } from '@/queries'
import { processFile } from '@/lib'

interface FileError {
  code: string
  message: string
  file: string
}

export const UploadCard = () => {
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FileError[] | null>(null)
  const { token, login } = useAuth()
  const [createProject] = useCreateProjectMutation()
  const [createNewVersion] = useCreateNewVersionMutation()
  const [createNewModel] = useCreateNewModelMutation()

  const handleClick = async () => {
    console.log('Upload file', file)
    const { data } = await createProject({ variables: { input: { name: file?.name } } })
    const projectId = data!.projectMutations.create.id as string
    const result = await processFile({
      file: file as File,
      projectId,
      token: token!,
    })

    const { data: versionData } = await createNewModel({ variables: { input: { projectId, name: file?.name || '' } } })
    const modelId = versionData?.modelMutations.create.id as string
    await createNewVersion({
      variables: {
        input: {
          projectId: projectId!,
          objectId: result.hash!,
          message: 'Uploading VTU Model',
          sourceApplication: 'VTU',
          modelId,
        },
      },
    })
  }

  const handleSpeckleLogin = () => {
    login()
  }

  const handleDrop = (acceptedFiles: File[]) => {
    setErrors([])
    setFile(acceptedFiles[0])
  }

  const handleReject = (fileRejections: FileRejection[]) => {
    setErrors(fileRejections.map((rejection) => ({ ...rejection.errors[0], file: rejection.file.name })))
  }

  const fileValidator = (file: File) => {
    const validExtension = file.name.endsWith('.vtu')
    if (!validExtension) {
      return {
        code: 'file-invalid-type',
        message: 'Invalid file type. Only .vtu files are allowed.',
      }
    }
    return null
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" h={'100%'} withBorder>
      <Stack justify={'space-between'} h={'100%'}>
        <Dropzone
          onDrop={handleDrop}
          onReject={handleReject}
          maxSize={50 * 1024 ** 2}
          multiple={false}
          validator={fileValidator}
        >
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconFile3d
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag VTU files here or click to select files
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed 50Mb
              </Text>
            </div>
          </Group>
          <div>
            {file ? (
              <Group>
                <IconFile3d stroke={0.7} />
                <Text size="sm">{file.name}</Text>
              </Group>
            ) : null}
          </div>
          {errors ? (
            <div>
              {errors.map((error) => (
                <Text size="sm" c="red">
                  File: {error.file} - {error.message}
                </Text>
              ))}
            </div>
          ) : null}
        </Dropzone>
        <Button mt="md" onClick={handleClick}>
          Upload
        </Button>
        {token ? null : (
          <Button mt="md" onClick={handleSpeckleLogin}>
            Login to Speckle
          </Button>
        )}
      </Stack>
    </Card>
  )
}
