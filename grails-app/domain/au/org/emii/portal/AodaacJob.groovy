package au.org.emii.portal

class AodaacJob {

    Date dateCreated

    String jobId

    AodaacJobParams jobParams
    AodaacJobStatus latestStatus
    AodaacJobResult result

    Date mostRecentFileExistCheck
    Boolean dataFileExists

    static embedded = ['jobParams', 'latestStatus', 'result']

    static belongsTo = [user: User]

    static constraints = {

        jobId blank: false

        latestStatus nullable: true
        result nullable: true
    }

    AodaacJob(){ /* For Hibernate */ }

    AodaacJob( user, jobId, jobParams ) {

        dateCreated = new Date()

        this.user = user
        this.jobId = jobId
        user.addToAodaacJobs this

        this.jobParams = new AodaacJobParams( jobParams )
    }

    @Override
    public String toString() {

        return "AodaacJob userId: $userId; jobId: $jobId (Status: $processingStatusText)"
    }

    def getProcessingStatusText() {

        def errorMsg = latestStatus?.theErrors ? ": ${latestStatus.theErrors}" : ""
        def hasErrors = latestStatus?.hasErrors ? " -- errors occurred$errorMsg" : ""

        if ( processingStatus == AodaacJobProcessingStatus.Started ) {

            return "Started ($percentComplete% complete$hasErrors)"
        }

        return "$processingStatus$hasErrors"
    }

    def getProcessingStatus() {

        if ( !latestStatus ) return AodaacJobProcessingStatus.Unknown

        if ( latestStatus.jobEnded ) return AodaacJobProcessingStatus.Complete

        if ( !latestStatus.started ) return AodaacJobProcessingStatus.Initialising

        return AodaacJobProcessingStatus.Started
    }

    def getPercentComplete() {

        if ( !latestStatus?.urlsComplete ) return 0

        return (int)( latestStatus.urlsComplete / latestStatus.urlCount ) * 100
    }
}

class AodaacJobParams {

    static def latRange = -90..90
    static def longRange = -180..180

    String server
    String environment

    String outputFormat

    Date dateRangeStart
    Date dateRangeEnd

    String timeOfDayRangeStart
    String timeOfDayRangeEnd

    Double latitudeRangeStart
    Double latitudeRangeEnd

    Double longitudeRangeStart
    Double longitudeRangeEnd

    Long productId

    static constraints = {

        server blank: false
        environment blank: false
        outputFormat blank: false

        latitudeRangeStart range: latRange
        latitudeRangeEnd range: latRange

        longitudeRangeStart range: longRange
        longitudeRangeEnd range: longRange

        timeOfDayRangeStart nullable: true, size: 4..4
        timeOfDayRangeEnd nullable: true, size: 4..4
    }
}

class AodaacJobStatus {

    Date statusDate = new Date()
    Boolean started
    Integer urlCount
    Integer urlsComplete
    Boolean datafileReady
    String warnings
    Boolean hasErrors
    String theErrors
    Boolean jobEnded
    Integer returnCode
    String cgiSeq

    static constraints = {
        returnCode nullable: true
    }
}

class AodaacJobResult {

    String dataUrl

    static constraints = {
        dataUrl blank: false
    }
}