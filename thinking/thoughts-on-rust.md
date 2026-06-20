---
title: Another article about rust
date: 2026-03-22
description: I'm tired of people talking about rust. So here I am to do it some more. Also some thoughts on AI
---

Rust arrived at the perfect time. And somehow, everybody knows what it is, even people who have never written a line of it. That's a rare thing. Compare that to something like Svelte, which is probably the most liked framework in the web community, consistently topping developer surveys. And yet Svelte doesn't have anywhere near the cultural reach that Rust does. People outside the web world have never heard of it. Rust has escaped its bubble in a way almost nothing else has.

I don't love the culture around it. The "written in Rust btw" crowd, the "blazingly fast" memes. It's the kind of thing that makes people roll their eyes. But underneath the noise, something real is happening. People keep talking about Rust even though other languages can match it on performance. Go is fast. Zig is fast. C is still C. But none of them generate the same conversation.

What I think people don't say enough is that Rust is genuinely hard. The compiler is impressive. It catches things that would be runtime bugs in any other language, but it doesn't make the language easy. It makes it *safer*. Those are different things. The borrow checker is a mental model you have to build from scratch, and traits can get complex enough that the real logic of your program gets buried. Memory safety is solved. Logic bugs are not. That's a distinction worth keeping in mind.

And yet the difficulty is part of the appeal. There's a status signal attached to it. If you're writing Rust, people assume you know what you're doing. That's not always fair, but it's real. The language has become a proxy for seriousness.

I do think Rust is a genuinely good language. I think it should be used more, especially in systems where correctness and safety actually matter. Its adoption in the Linux kernel is a remarkable thing. That project is not known for welcoming new ideas, and yet here we are.

But I also think Rust may be a one-of-a-kind event. The conditions that made it possible, the timing, the frustration with C and C++, the growing pressure around memory safety vulnerabilities, those conditions won't repeat exactly. And now AI is increasingly making the first cut on tech stack decisions. Performance is also less of a forcing function than it used to be. CPUs and GPUs are powerful enough that most applications don't need to squeeze every cycle. Until they do.

I don't think another language will break into the mainstream the same way Rust has. It arrived at exactly the right moment and filled a gap that people didn't fully know was there. Whether that moment lasts, or whether it becomes a niche tool for the people who really need it while everyone else moves on. That's the part I find genuinely interesting to watch.
