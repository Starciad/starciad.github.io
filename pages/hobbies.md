---
layout: page
label: hobbies
section: hobbies

title: Hobbies
permalink: /hobbies/
---

{% assign hobbies = site.hobbies | sort: "title" %}

{% for hobby in hobbies %}
- [{{ hobby.title }}]({{ hobby.url | relative_url }})
{% endfor %}
