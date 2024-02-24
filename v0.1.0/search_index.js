var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = Chairmarks","category":"page"},{"location":"#Chairmarks","page":"Home","title":"Chairmarks","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for Chairmarks.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [Chairmarks]","category":"page"},{"location":"#Chairmarks.@b-Tuple","page":"Home","title":"Chairmarks.@b","text":"@b [[init] setup] f [teardown] keywords...\n\nBenchmark f and return the fastest result\n\nUse @be for full results.\n\nPositional argument pipeline syntax\n\nThe four positional arguments form a pipeline with the return value of each passed as an argument to the next. Consequently, the first expression in the pipeline must be a nullary function. If you use a symbol like rand, it will be interpreted as a function and called normally. If you use any other expression, it will be interpreted as the body of a nullary function. For example in @b rand(10) the function being benchmarked is () -> rand(10).\n\nLater positions in the pipeline must be unary functions. As with the first function, you may provide either a function, or an expression. However, the rules are slightly different. If the expression you provide contains an _ as an rvalue (which would otherwise error), it is interpreted as a unary function and any such occurrences of _ are replaced with result from the previous function in the pipeline. For example, in @b rand(10) sort(_, rev=true) the setup function is () -> rand(10) and the primary function is x -> sort(x, rev=true). If the expression you provide does not contain an _ as an rvalue, it is assumed to produce a function and is called with the result from the previous function in the pipeline. For example, in @b rand(10) sort!∘shuffle!, the primary function is simply sort!∘shuffle! and receives no preprocessing. @macroexpand can help elucidate what is going on in specific cases.\n\nPositional argument disambiguation\n\nsetup, teardown, and init are optional and are parsed with that precedence giving these possible forms:\n\n@b f\n@b setup f\n@b setup f teardown\n@b init setup f teardown\n\nYou may use an underscore _ to provide other combinations of arguments. For example, you may provide a teardown and no setup with\n\n@b _ f teardown\n\nKeyword arguments\n\nProvide keyword arguments using name=value syntax similar to how you provide keyword arguments to ordinary functions. Keyword arguments to control executions are\n\nevals::Integer How many function evaluations to perform in each sample. Defaults to automatic calibration.\nsamples::Integer Maximum number of samples to take. Defaults to unlimited and cannot be specified without also specifying evals. Specifying samples = 0 will cause @b to run the warmup sample only and return that sample.\nseconds::Real Maximum amount of time to spend benchmarking. Defaults to 0.1 seconds unless samples is specified in which case it defaults to 1 second. Set to Inf to disable the time limit. Compile time is typically not counted against this limit. A reasonable effort is made to respect the time limit, but it is always exceeded by a small about (less than 1%) and can be significantly exceeded when benchmarking long running functions.\n\nEvaluation model\n\nAt a high level, the implementation of this function looks like this\n\nx = init()\nresults = []\nfor sample in 1:samples\n    y = setup(x)\n\n    t0 = time()\n\n    z = f(y)\n    for _ in 2:evals\n        f(y)\n    end\n\n    push!(results, time()-t0)\n\n    teardown(z)\n\nend\n\nSo init will be called once, setup and teardown will be called once per sample, and f will be called evals times per sample.\n\nExamples\n\njulia> @b rand(10000) # Benchmark a function\n5.833 μs (2 allocs: 78.172 KiB)\n\njulia> @b rand hash # How long does it take to hash a random Float64?\n1.757 ns\n\njulia> @b rand(1000) sort issorted(_) || error() # Simultaneously benchmark and test\n11.291 μs (3 allocs: 18.062 KiB)\n\njulia> @b rand(1000) sort! issorted(_) || error() # BAD! This repeatedly resorts the same array!\n1.309 μs (0.08 allocs: 398.769 bytes)\n\njulia> @b rand(1000) sort! issorted(_) || error() evals=1 # Specify evals=1 to ensure the function is only run once between setup and teardown\n10.041 μs (2 allocs: 10.125 KiB)\n\njulia> @b rand(10) _ sort!∘rand! issorted(_) || error() # Or, include randomization in the benchmarked function and only allocate once\n120.536 ns\n\njulia> @b (x = 0; for _ in 1:50; x = hash(x); end; x) # We can use arbitrary expressions in any position in the pipeline, not just simple functions.\n183.871 ns\n\njulia> @b (x = 0; for _ in 1:5e8; x = hash(x); end; x) # This runs for a long time, so it is only run once (with no warmup)\n2.447 s (without a warmup)\n\n\n\n\n\n","category":"macro"},{"location":"#Chairmarks.@be-Tuple","page":"Home","title":"Chairmarks.@be","text":"@be [[init] setup] f [teardown] keywords...\n\nBenchmark f and return the results\n\nUse @b for abbreviated results.\n\nPositional argument pipeline syntax\n\nThe four positional arguments form a pipeline with the return value of each passed as an argument to the next. Consequently, the first expression in the pipeline must be a nullary function. If you use a symbol like rand, it will be interpreted as a function and called normally. If you use any other expression, it will be interpreted as the body of a nullary function. For example in @be rand(10) the function being benchmarked is () -> rand(10).\n\nLater positions in the pipeline must be unary functions. As with the first function, you may provide either a function, or an expression. However, the rules are slightly different. If the expression you provide contains an _ as an rvalue (which would otherwise error), it is interpreted as a unary function and any such occurrences of _ are replaced with result from the previous function in the pipeline. For example, in @be rand(10) sort(_, rev=true) the setup function is () -> rand(10) and the primary function is x -> sort(x, rev=true). If the expression you provide does not contain an _ as an rvalue, it is assumed to produce a function and is called with the result from the previous function in the pipeline. For example, in @be rand(10) sort!∘shuffle!, the primary function is simply sort!∘shuffle! and receives no preprocessing. @macroexpand can help elucidate what is going on in specific cases.\n\nPositional argument disambiguation\n\nsetup, teardown, and init are optional and are parsed with that precedence giving these possible forms:\n\n@be f\n@be setup f\n@be setup f teardown\n@be init setup f teardown\n\nYou may use an underscore _ to provide other combinations of arguments. For example, you may provide a teardown and no setup with\n\n@be _ f teardown\n\nKeyword arguments\n\nProvide keyword arguments using name=value syntax similar to how you provide keyword arguments to ordinary functions. Keyword arguments to control executions are\n\nevals::Integer How many function evaluations to perform in each sample. Defaults to automatic calibration.\nsamples::Integer Maximum number of samples to take. Defaults to unlimited and cannot be specified without also specifying evals. Specifying samples = 0 will cause @be to run the warmup sample only and return that sample.\nseconds::Real Maximum amount of time to spend benchmarking. Defaults to 0.1 seconds unless samples is specified in which case it defaults to 1 second. Set to Inf to disable the time limit. Compile time is typically not counted against this limit. A reasonable effort is made to respect the time limit, but it is always exceeded by a small about (less than 1%) and can be significantly exceeded when benchmarking long running functions.\n\nEvaluation model\n\nAt a high level, the implementation of this function looks like this\n\nx = init()\nresults = []\nfor sample in 1:samples\n    y = setup(x)\n\n    t0 = time()\n\n    z = f(y)\n    for _ in 2:evals\n        f(y)\n    end\n\n    push!(results, time()-t0)\n\n    teardown(z)\n\nend\n\nSo init will be called once, setup and teardown will be called once per sample, and f will be called evals times per sample.\n\nExamples\n\njulia> @be rand(10000) # Benchmark a function\nBenchmark: 267 samples with 2 evaluations\nmin    8.500 μs (2 allocs: 78.172 KiB)\nmedian 10.354 μs (2 allocs: 78.172 KiB)\nmean   159.639 μs (2 allocs: 78.172 KiB, 0.37% gc time)\nmax    39.579 ms (2 allocs: 78.172 KiB, 99.93% gc time)\n\njulia> @be rand hash # How long does it take to hash a random Float64?\nBenchmark: 4967 samples with 10805 evaluations\nmin    1.758 ns\nmedian 1.774 ns\nmean   1.820 ns\nmax    5.279 ns\n\njulia> @be rand(1000) sort issorted(_) || error() # Simultaneously benchmark and test\nBenchmark: 2689 samples with 2 evaluations\nmin    9.771 μs (3 allocs: 18.062 KiB)\nmedian 11.562 μs (3 allocs: 18.062 KiB)\nmean   14.933 μs (3 allocs: 18.097 KiB, 0.04% gc time)\nmax    4.916 ms (3 allocs: 20.062 KiB, 99.52% gc time)\n\njulia> @be rand(1000) sort! issorted(_) || error() # BAD! This repeatedly resorts the same array!\nBenchmark: 2850 samples with 13 evaluations\nmin    1.647 μs (0.15 allocs: 797.538 bytes)\nmedian 1.971 μs (0.15 allocs: 797.538 bytes)\nmean   2.212 μs (0.15 allocs: 800.745 bytes, 0.03% gc time)\nmax    262.163 μs (0.15 allocs: 955.077 bytes, 98.95% gc time)\n\njulia> @be rand(1000) sort! issorted(_) || error() evals=1 # Specify evals=1 to ensure the function is only run once between setup and teardown\nBenchmark: 6015 samples with 1 evaluation\nmin    9.666 μs (2 allocs: 10.125 KiB)\nmedian 10.916 μs (2 allocs: 10.125 KiB)\nmean   12.330 μs (2 allocs: 10.159 KiB, 0.02% gc time)\nmax    6.883 ms (2 allocs: 12.125 KiB, 99.56% gc time)\n\njulia> @be rand(10) _ sort!∘rand! issorted(_) || error() # Or, include randomization in the benchmarked function and only allocate once\nBenchmark: 3093 samples with 237 evaluations\nmin    121.308 ns\nmedian 126.055 ns\nmean   128.108 ns\nmax    303.447 ns\n\njulia> @be (x = 0; for _ in 1:50; x = hash(x); end; x) # We can use arbitrary expressions in any position in the pipeline, not just simple functions.\nBenchmark: 3387 samples with 144 evaluations\nmin    183.160 ns\nmedian 184.611 ns\nmean   188.869 ns\nmax    541.667 ns\n\njulia> @be (x = 0; for _ in 1:5e8; x = hash(x); end; x) # This runs for a long time, so it is only run once (with no warmup)\nBenchmark: 1 sample with 1 evaluation\n       2.488 s (without a warmup)\n\n\n\n\n\n","category":"macro"}]
}
