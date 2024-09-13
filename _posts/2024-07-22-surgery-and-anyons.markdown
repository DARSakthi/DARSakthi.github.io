---
title: 'Surgeries and Anyon Condensation'
date: 2024-07-22
permalink: /posts/2024/07/surgery-and-anyons/
layout: post
usemathjax: true
published: true
tags:
  - projects and papers
  - reading guides
---

Here I will provide some geometric intuition for the discussions in a recent preprint with [Y L Liu](https://leon2k2k2k.github.io/). (The title of this blog post is the unused title of an older draft and was proposed by Leon.)

In that preprint we share some results relating classifications of abelian topological orders to surgery classifications of (spin) three-manifolds, turning geometric reasoning about a given manifold into algebraic manipulation of the associated Chern-Simons theory and _vice versa_.

This is not the post for my soapbox on intuition and geometric reasoning (I'll write one some day) but broadly speaking I subscribe to the [Atiyah school of thought](https://www.cambridge.org/core/journals/bulletin-of-the-london-mathematical-society/article/mathematics-in-the-20th-century/B4083D7C96DD1FC45226542E386E166A) on this matter; so to supplement the calculations in that paper I'll discuss some of the thinking that went into them here.

# The idea

The idea behind the paper is as follows. Leon and I have been discussing what CFT and bulk boundary correspondences know about surgery on the boundaries of four-manifolds. 

%%%%%%%%%%It was his hypothesis about a certain anomaly maybe arising from Poincaré duality which kicked things off and I just said some fancy topology words
Specifically he has this nice abelian duality paper in communications (apparently it was his undergrad thesis) where he shows there’s an anomaly arising from Fourier duality in the sense that a certain dual TFT needs to be tensored with an invertible TFT to actually be equal to its S dual

%%%%%The key idea is that a condition on the linking form being integral is equivalent to some abelian CS theory being chiral

%%%%%%%%Specifically he has this nice abelian duality paper in communications (apparently it was his undergrad thesis) where he shows there’s an anomaly arising from Fourier duality in the sense that a certain dual TFT needs to be tensored with an invertible TFT to actually be equal to its S dual. So he wanted to know if this says anything topological and we went back and forth on it and landed on this

%%%%%But chiral means anomalous no? So then that should mean an integrality of the linking form should translate somehow into there being a framing anomaly of the bulk theory? But it’s exactly tied to the linking form appearing in the partition function. It’s the exponential of a quadratic refinement of L
So there’s a lift involved and some short exact sequences and such
But basically yes

It is known that certain algebraic data can be associated to a Chern--Simons theory by a paper of Belov--Moore. This algebraic data comes from a three-manifold in a very concrete way. In this paper we use this observation to take a slightly different approach from what one usually sees in studying quantum field theory and manifold invariants: we associate a _particular_ $(2+1)$-dimensional topological field theory to any spin three-manifold, study its topological phases, and turn geometric statements about the manifold into algebraic manipulation of the associated theory. In particular, this assignment allows us to relate classifications of abelian topological orders to surgery classifications of three-manifolds.[^1]

The main result of interest is that we can discuss forming topological orders by manipulating that algebraic data. In anyon condensation, we create gapped boundaries by identifying bosons with the vacuum and screen out those anyons which braid non-trivially with them. This is analogous to the effects of surgery on homology classes in the following sense: take a knot whose class in first homology is torsion and perform a surgery on the knot which reduces $H_1$ to its annihilator subgroup. The general idea of this section will be that performing surgery on a longitude of a knot whose class in first homology $a$ is torsion reduces the first homology of $N$ to the annihilator subgroup of $a$, condensing that anyon and creating the topological order sought. 

More particularly, in a classic paper of Wall, one studies the effect of surgery on $m$-th homology in $(2m+1)$-dimensional compact connected manifolds. Let $N$ be a three-manifold, $N-\nu$ be $N$ with the normal bundle of the component of a link $x$ removed, and $N'$ be the resulting three-manifold after trivialising the link. Suppose we have three-manifold $N$ equipped with a spin structure and a Chern--Simons theory determined by $(D = H_1(N)^{\mathrm{tor}}, q)$. Take a torsion element $a \in D$ with $q(a) = 0$ and let $K$ be a knot representing $a$. We will consider a parallel $\ell$, representing a lift of $a$ to $H_1(N - \nu)$, where $\nu$ is a tubular neighborhood of $\ell$. Since $L(a,a) = 0$, from the discussion above, there is precisely one homology class of $\ell$ such that $[\ell]$ is torsion in $H_1(N- \nu)$. Furthermore, $\ell$ induces a framing on the knot, and $q(\ell) = 0$ if and only if the framing restricts from the spin structure on $N$ to the bounding spin structure on $K$. Now when we do surgery, we can glue $N - \nu$ with the trivial spin structure on $S_m^1 \times D^2$, since both restrict to the trivial spin structure on the boundary $S_m^1 \times S_\ell^1$. The new manifold $N' = (N - \nu) \sqcup_{S_m^1 \times S_\ell^1} S_m^1 \times D^2$ now has a canonical spin structure. Lastly, we can remove the free class generated by the meridian. Performing surgery on $m$ causes the new class in the homology of $N-\nu$ to vanish, obtained from killing the meridian or an indivisible element of $H_1(N')$. 

We can see this as Wall giving a prescription for how to reduce a manifold of dimension $2m+1$ to an $(m-1)$-connected manifold by surgering classes in middle-dimensional homology. We took inspiration from Wall's reasoning about surgery's effect on homology to give a surgery procedure that performs anyon condensation by trivialising a deleted neighbourhood of a link component, resulting in a hollow torus, and gluing on a disc whose boundary is the meridian of the torus.

The basic procedure is the following: let $N$ be a closed oriented three-manifold together with a knot $K$ in $N$. Let $\nu$ denote its tubular neighborhood. We need to frame the knot by finding an isomorphism $\nu \simeq S^1_K \times D^2$. The $S^1$ circle is the meridian. Note that this defines a parallel $l = S^1_K \times {e}$ of the knot, where $e \in \partial D^2$. The data of $l$ is equivalent to framing. 


[^1]: Note that we do _not_ actually have a functorial classification, however if two even surgery presentations are related by finitely many Kirby diagrams then the resulting spin three-manifolds are diffeomorphic. Hence (i) the torsion piece of $H_1$ is preserved and (ii) they are spin nullbordant. Since $(H_1^{\mathrm{tor}}, q)$ does not change these correspond to the same Belov--Moore class of quantum field theories. Since they are spin nullbordant the domain wall between the two is trivial. In other words, Belov--Moore ask: ''when do two classical CS theories describe the same quantum CS theory (obtained by the $(D,q)$ classification)?'' Kirby asks: ''when do two surgery presentations give us homeomorphic three-manifolds (_i.e._ are related by finitely many Kirby moves)?'' This work relates the answers to those questions.

