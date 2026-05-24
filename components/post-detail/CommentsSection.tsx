import Utterances from '../utterrances/Utterrances'

// Comments section (issue #153): English "Comments" heading + the Utterances
// widget. Utterances now syncs its theme with the site's next-themes toggle
// (#148) internally, so no theme prop is passed here.
const CommentsSection = () => (
  <section>
    <h2 className="m-0 mb-5 text-xl font-semibold text-text-heading border-0 p-0">Comments</h2>
    <Utterances
      repo="code-logs/code-logs.github.io"
      issueTerm="title"
      issueLabel="Comment"
    />
  </section>
)

export default CommentsSection
