---
layout: page
label: experiences
section: experiences

title: Experiências
permalink: /experiences/
---

{% assign experiences = site.experiences | sort: "title" %}

{% for experience in experiences %}
- [{{ experience.title }}]({{ experience.url | relative_url }})
{% endfor %}
