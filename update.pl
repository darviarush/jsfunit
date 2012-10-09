#!/usr/bin/env perl

# Script registration tests in tests-js. It runs without parameters.
# Or with catalog name, where are tests
# update.pl [catalog]
# update.pl tests-js  ===  update.pl

$catalog = 'tests-js' unless $catalog;

$path = $0;
$path =~ tr/\\/\//; # For windows
$path =~ s/\/[^\/]*$/\//;

$path = '.' unless $path =~ /\//;

$path =~ s/\/$//;

open f, ">$path/Tests.js" or die "Not open $path/Tests.js\n";

print f "// generated update.pl
// name, paths

var Tests = [
";

sub quote {
	local ($&, $`, $');
	$_[0] =~ s/[\\\"\']/\\$&/g;
	$_[0] =~ s/\n/\\n/g;
	$_[0] =~ s/\r/\\r/g;
}

$" = '", "';
$name_all = "Root Tests";

@dirs = ();
@out = ();

@path = ("$path/$catalog");

while(@path) {
	$xpath = pop @path;
	@dir = ();
	opendir dir, $xpath;
	while($file = readdir dir) {
		next if $file =~ /^\./;
		$_ = "$xpath/$file";
		print "$_\n";
		if(-d $_) {	
			push @path, $_;
		} elsif($file =~ /\.js$/) {
			push @dir, $_;
		}
	}
	closedir dir;
	$name_all = '', next unless @dir;
	
	quote($_) for @dir;
	$xpath =~ s/^$path\/$catalog\/?/$name_all/;
	$name_all = '';
	quote($xpath);
	$_ =~ s/^$path\/?// for @dir;
	push @out, "[\"$xpath\", [\"@dir\"]],\n";
	$ps = $_, $ps =~ s/^$catalog\/?//, $ps =~ s/\.js$//, push @out, "[\"$ps\", [\"$_\"]],\n" for @dir;
	@dirs = (@dirs, @dir);
}

print f "[\"All Tests\", [\"@dirs\"]],\n";
print f for @out;

seek f, -2, 1;

print f "\n];\n";

