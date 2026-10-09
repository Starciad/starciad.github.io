---
layout: page
label: projects
section: projects

title: Projetos
permalink: /projects/
---

{% assign projects = site.projects | sort: "date" | reverse %}

{% for project in projects %}
- [{{ project.title }}]({{ project.url | relative_url }}) **({{ project.date | date: "%Y" }})**: {{ project.short_description }}
{% endfor %}
