import { send } from '@speckle/objectsender'

interface ProcessFileProps {
  file: File
  token: string
  projectId: string
}

export const processFile = async ({ file, token, projectId }: ProcessFileProps) => {
  const speckleObjects = {}

  try {
    return {
      ...(await send(speckleObjects, {
        serverUrl: import.meta.env.VITE_SPECKLE_SERVER_URL,
        token,
        projectId,
      })),
      error: undefined,
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : JSON.stringify(e), hash: undefined, traversed: undefined }
  }
}