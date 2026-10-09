---
layout: page
label: hobbies
section: hobbies

title: Hobbies
permalink: /hobbies/
---

{% assign categories = site.hobbies | group_by: "category" | sort: "title" %}

{% for category in categories %}

{% assign categoryString = site.data.strings | where: "id", category.name | first %}
{% assign categoryItems = category.items | sort: "title" %}

## {{ categoryString.label }}

{% for hobby in categoryItems %}
- [{{ hobby.title }}]({{ hobby.url | relative_url }})
{% endfor %}

{% endfor %}
