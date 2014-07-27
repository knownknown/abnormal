# Database

integrate animated pie charts:
http://www.chartjs.org/docs/#getting-started-creating-a-chart

Every question is an object containing:
- _id
- question text
- type (numeric/binary/etc)
- number of answers
- some summary stats (mean/variance)
- summary distribution (an x and normalized y array)
- collection of previously known distributions, each having:
	- source
	- distribution

# Dashboard

- List all of the currently available questions: text and number of responses.
- Allow modifying text / deleting each question
- Allow adding/deleting a known distribution to each question
- Allow recomputing the summary stats/distribution given the votes
- Add question form
	- Question text
	- Question type (numeric/binary/etc)
- Potentially allow specific questions to come in pairs (?)

# Landing page

- Randomly select a question to ask and provide form for answer or skip
- After answer scroll to next question
- After enough answers, reveal distribution of ordered (or "starred" question, keep track of what gets starred)