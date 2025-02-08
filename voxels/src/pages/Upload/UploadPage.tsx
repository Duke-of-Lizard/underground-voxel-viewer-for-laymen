import { Grid } from '@mantine/core'
import { SidePanel, UploadCard } from '@/components'

export const UploadPage = () => {
  return (
    <Grid>
      <Grid.Col span={3} h={'80vh'}>
        <SidePanel />
      </Grid.Col>
      <Grid.Col span={9} h={'80vh'}>
        <UploadCard />
      </Grid.Col>
    </Grid>
  )
}
