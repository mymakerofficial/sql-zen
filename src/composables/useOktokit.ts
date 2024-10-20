import { Octokit } from 'octokit'
import { useQuery } from '@tanstack/vue-query'

let octokit: Octokit | null = null

export function useOktokit() {
  if (!octokit) {
    octokit = new Octokit()
  }
  return octokit
}

export function useGetLatestRelease() {
  const octokit = useOktokit()
  return useQuery({
    queryKey: ['latest-release'],
    queryFn: async () => {
      const { data } = await octokit.rest.repos.getLatestRelease({
        owner: 'mymakerofficial',
        repo: 'sql-zen',
      })
      return data
    },
  })
}
