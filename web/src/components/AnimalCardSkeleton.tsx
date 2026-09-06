import { Box, Skeleton } from '@mui/material'
import { tokens } from '../theme/theme'

export function AnimalCardSkeleton() {
  return (
    <Box
      sx={{
        border: `1.5px solid ${tokens.border}`,
        borderRadius: 1,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <Box sx={{ p: 2.5 }}>
        <Skeleton variant="text" width="60%" height={32} animation="wave" />
        <Box sx={{ display: 'flex', gap: 0.75, my: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} animation="wave" />
          <Skeleton variant="rounded" width={100} height={24} animation="wave" />
        </Box>
        <Skeleton variant="text" animation="wave" />
        <Skeleton variant="text" width="80%" animation="wave" />
        <Skeleton variant="rounded" height={42} sx={{ mt: 1.5 }} animation="wave" />
      </Box>
    </Box>
  )
}
