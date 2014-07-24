# Abnormal
A web-site for curating and analyzing life's difficult questions.

# Notes

## Database configuration
The following commands were run to generate dummy database entries:

    use abnormal
    db.qlist.insert({text:'What is your height in cM?',type:1,answers:0})
    db.qlist.insert({text:'Do you believe in a higher power?',type:2,answers:0})
    db.qlist.find()