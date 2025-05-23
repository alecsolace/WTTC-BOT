import { CronJob } from 'cron'

import { Service } from '@/decorators'

import { SyncService } from './SyncService'

@Service()
export class Scheduler {

	private _jobs: Map<string, CronJob> = new Map()

	get jobs() {
		return this._jobs
	}

	addJob(jobName: string, job: CronJob) {
		this._jobs.set(jobName, job)
	}

	startJob(jobName: string) {
		this._jobs.get(jobName)?.start()
	}

	stopJob(jobName: string) {
		this._jobs.get(jobName)?.stop()
	}

	stopAllJobs() {
		this._jobs.forEach(job => job.stop())
	}

	startAllJobs() {
		this._jobs.forEach(job => job.start())
	}

	initializeSyncJob(syncService: SyncService) {
		// Runs every day at 03:00 AM
		const job = new CronJob('0 3 * * *', async () => {
			await syncService.syncAll()
		})
		this.addJob('syncAllJob', job)
		this.startJob('syncAllJob')
	}

}
